const {App, WorkflowStep, ExpressReceiver} = require("@slack/bolt");
const functions = require("firebase-functions");

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: "/events",
  processBeforeResponse: true,
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true,
});

const ws = new WorkflowStep("new_github_issue", {
  edit: async ({ack, step, configure}) => {
    await ack();

    const blocks = [
      {
        type: "section",
        block_id: "intro-section",
        text: {
          type: "plain_text",
          text: "Create a task in one of the listed projects. ",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "task_name_input",
        element: {
          type: "plain_text_input",
          action_id: "name",
          placeholder: {
            type: "plain_text",
            text: "Write a task name",
          },
        },
        label: {
          type: "plain_text",
          text: "Task name",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "task_description_input",
        element: {
          type: "plain_text_input",
          action_id: "description",
          placeholder: {
            type: "plain_text",
            text: "Write a description for your task",
          },
        },
        label: {
          type: "plain_text",
          text: "Task description",
          emoji: true,
        },
      },
      {
        type: "input",
        block_id: "task_author_input",
        element: {
          type: "plain_text_input",
          action_id: "author",
          placeholder: {
            type: "plain_text",
            text: "Write a task name",
          },
        },
        label: {
          type: "plain_text",
          text: "Task author",
          emoji: true,
        },
      },
    ];

    await configure({blocks});
  },
  save: async ({ack, step, update, view}) => {
    // await ack();

    // const {
    //   taskTitleInput,
    // } = view.state.values;

    // const taskTitle = taskTitleInput.name.value;

    // const inputs = {
    //   taskTitle: {value: taskTitle},
    // };

    // const outputs = [
    //   {
    //     type: "text",
    //     name: "taskTitle",
    //     label: "依頼タイトル",
    //   },
    // ];

    // await update({inputs, outputs});
  },
  execute: async ({step, complete, fail, client}) => {
    // try {
    //   const {taskTitle} = step.inputs;

    //   const outputs = {
    //     taskTitle: taskTitle.value,
    //   };

    //   await complete({outputs});
    // } catch (e) {
    //   // TODO if something went wrong, fail the step ...
    //   app.logger.error("Error completing step", e.message);
    // }
  },
});

app.step(ws);

exports.slack = functions
    .region("asia-northeast1")
    .runWith({
      minInstances: 1,
    })
    .https.onRequest(expressReceiver.app);
