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

            results.map((block) => {
                if (block.type == 'toggle' && block.has_children) {
                    console.log(block)

                    // these are the names of the csv's 
                    block.toggle.text.map((toggle) => {
                        console.log(toggle.plain_text);
                    })
                }
            });
            return results
        } catch(error) {
            console.error(error)
        }
    }
};
module.exports = model;
