// models/bootcamp.model.js

// This file contains code to make operations on the DB
const notion = require("../services/notion");
const courseDatabaseId = process.env.NOTION_DATABASE_ID;
const mailingListDatabaseId = process.env.NOTION_MAILING_LIST_ID;
const model = {
  // list all the courses in the DB
getCourses: async () => {
    try {
      const { results } = await notion.databases.query({
        database_id: courseDatabaseId,
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
  }
};
module.exports = model;
