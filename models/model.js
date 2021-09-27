// models/bootcamp.model.js

// This file contains code to make operations on the DB
const { blocksChildrenList } = require("@notionhq/client/build/src/api-endpoints");
const notion = require("../services/notion");
const databaseId = process.env.NOTION_DATABASE_ID;
const pageId = process.env.NOTION_PAGE_ID;
const gcpBlockId = process.env.NOTION_GCP_BLOCK_ID
const model = {
  // list all the courses in the DB
    getDatabaseEntries: async () => {
        try {
            const { results } = await notion.databases.query({
                database_id: databaseId,
            });
            const res = results.map((page) => {
                return {
                    pageId: page.id,
                //   videoURL: page.properties["YouTube Video"].url,
                    title: page.properties.Name.title[0].plain_text,
                //   tags: page.properties.Tags.multi_select.map((tag) => tag.name),
                //   summary: page.properties.Summary.rich_text[0].plain_text,
                //   author: page.properties.Author.rich_text[0].plain_text,
                //   startDate: page.properties.Date.date.start,
                //   endDate: page.properties.Date.date.end,
                };
            });
            return res;
        } catch (error) {
            console.error(error);
        }
    },
    getProgrammingPage: async () => {
        try {
            const { results } = await notion.blocks.children.list({
                block_id: gcpBlockId
            });

            // TODO: Here we need to put the logic of putting things into csv properly

            // 1. if toggle name contains Content or Questions
                // 1.1 the toggles texts within them are the questions
                // 1.2 the information in the toggle are the answers
            // 2. for each chapter, take the chapter name and create a .csv for it
                // 2.1 name the csv {CHAPTER TOGGLE NAME}.csv
                // 2.2 insert the values above into it 
            var chapterNamesAndBlockIds = {};
            results.map(async (block) => {
                if (block.type == 'toggle') {
                    for (let i=0; i < block.toggle.text.length; i++){
                        console.log(block.toggle.text[i].plain_text);
                        if (block.toggle.text[i].plain_text != 'Objective map'){
                            // these are the names of the csv's and their block id's containing content and questions
                            chapterNamesAndBlockIds[block.toggle.text[i].plain_text] = {"ChapterBlockID": block.id };
                        }
                        console.log("making request for id: " + block.id + " with chapter name " + block.toggle.text[i].plain_text);
                            try {
                                console.log("try");
                                var contentAndQuestions = await notion.blocks.children.list({
                                    block_id: block.id
                                });
                                chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["ContentBlockID"] = contentAndQuestions.results[0].id;
                                chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["QuestionsBlockID"] = contentAndQuestions.results[1].id;
                                var contentQuestions = await notion.blocks.children.list({
                                    block_id: chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["ContentBlockID"]
                                })
                                var questionQuestions = await notion.blocks.children.list({
                                    block_id: chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["QuestionsBlockID"]
                                })
                                togglesInsideChapterContent = {}
                                for (var j=0; j < contentQuestions.results.length; j++){
                                    if (contentQuestions.results[j].type == 'toggle') {
                                        contentQuestionIndex = "ContentQuestion" + j.toString();
                                        contentQuestionToggleText = await notion.blocks.children.list({
                                            block_id: contentQuestions.results[j].id
                                        });
                                        togglesInsideChapterContent[block.toggle.text[i].plain_text] = { contentQuestionIndex : contentQuestions.results[j].id };
                                        console.log("Content " + block.toggle.text[i].plain_text + " question id " + j.toString() + " : " + contentQuestions.results[j].id);
                                        console.log(contentQuestionToggleText)
                                    }
                                }
                                // togglesInsideChapterQuestions = {}
                                // for (var k=0; k < questionQuestions.results.length; k++){
                                //     console.log("Question " + block.toggle.text[i].plain_text + " question: " + k.toString() + " : " + questionQuestions.results[k].id);
                                // }
                                // console.log("content:", contentAndQuestions.results[0].id);
                                // console.log("questions:", contentAndQuestions.results[1].id);
                                // console.log(chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["ContentBlockID"])
                                // console.log(chapterNamesAndBlockIds[block.toggle.text[i].plain_text]["QuestionsBlockID"])
                                // for (let j=0; j <)

                                // need to make another request for the blocks within the content and questions blocks using their id's


                                // console.log("content: "+ block.toggle.text[i].plain_text + ": "+ contentAndQuestions.results[0].toggle.text);
                                // console.log("questions:" + block.toggle.text[i].plain_text + ": "+ contentAndQuestions.results[1].toggle.text);
                            } catch(error) {
                                console.log("catch");
                                console.log(error);
                            };
                        }
                    }
                }
            );
            console.log(chapterNamesAndBlockIds)
            return chapterNamesAndBlockIds;
        } catch(error) {
            console.error(error)
        }
    },
    
};
module.exports = model;
