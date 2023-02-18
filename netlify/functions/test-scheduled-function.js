const { schedule } = require("@netlify/functions")
const main = require("../../index.js")
const {CONST} = require("../../main/myConfig.js")

const handler = async function (event, context) {
	//console.log("Received event:", event);

	console.log("Handler Init..")
	const {playListId, dataBase, messages} = CONST
	//await main.mainBot(playListId, dataBase, messages)
	console.log("Handler Finish...")

	return {
		statusCode: 200,
	}
}

exports.handler = schedule("*/1 * * * *", handler)
