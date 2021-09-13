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
            // results.map((blocksChildrenList) => {
            //     console.log(blocksChildrenList);
            // });
            return results
        } catch(error) {
            console.error(error)
        }
    }
};
module.exports = model;
