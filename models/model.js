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
            results.map((block) => {
                if (block.type == 'toggle') {
                    for (let i=0; i < block.toggle.text.length; i++){
                        console.log(block.toggle.text[i].plain_text);
                        if (block.toggle.text[i].plain_text != 'Objective map'){
                            chapterNamesAndBlockIds[block.toggle.text[i].plain_text] = block.id;
                        }
                        console.log("making request for id: " + block.id + " with chapter name " + block.toggle.text[i].plain_text);
                        try {
                            var contentAndQuestions = notion.blocks.children.list({
                                block_id: block.id
                            });
                            console.log(contentAndQuestions);
                        } catch(error) {
                            console.log(error);
                        };
                    }
                    // these are the names of the csv's and their block id's containing content and questions
                }
            });
            // get the Content and Questions blocks
            // getContentAndQuestions: async(chapterNamesAndBlockIds) => {
            //     try {
            //         const {contentAndQuestions} = await notion.blocks.children.list({
            //             block_id: block.id
            //         });
            //         console.log(contentAndQuestions);
            //     } catch(error) {
            //         console.log(error);
            //     }
            // }
            return chapterNamesAndBlockIds;
        } catch(error) {
            console.error(error)
        }
    },
    
};
module.exports = model;
