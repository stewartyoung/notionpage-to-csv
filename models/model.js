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
                    title: page.properties.Name.title[0].plain_text,
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
                                        console.log("Content " + block.toggle.text[i].plain_text + " question id " + j.toString() + " : " + contentQuestions.results[j].id + " : " + contentQuestions.results[j]);
                                        console.log(contentQuestions.results[j].toggle.text[0].plain_text);
                                        console.log(contentQuestionToggleText);
                                    }
                                }
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
