require("dotenv").config()
const sc = require("./main/sc")
const db = require("./main/dataBase")

const { Telegraf } = require("telegraf")
const bot = new Telegraf(process.env.BOT_TOKEN)
const idChat = process.env.CHAT_ID

console.log("Index Load")

const mainBot = async function (idPlayList, dataBase, messages) {
	//GET LAST ID
	let newData = await db.getLastIdsSent(dataBase.url)
	let lastIdsSent = newData.lastIds
	if (lastIdsSent == null) return
	if (newData.lastPlayList != idPlayList) lastIdsSent = []

	//GET NEW VIDS
	let newVids = await sc.getNewVids(idPlayList, lastIdsSent)
	if (newVids == null) return
	if (newVids == "FULL") {
		if (messages.fullList != "") {
			await bot.telegram.sendMessage(idChat, messages.fullList)
		}
		return
	}

	if (newVids == "EMPTY") {
		let sv = await db.saveLastId(dataBase, [], idPlayList)
		return
	}

	//SEND NEW VIDSS
	let element = newVids[0]
	console.log("Enviar " + element.id + " - " + element.title)

	//GET STREAM
	let urls = await sc.getStream(element.id)
	//bot.telegram.sendMessage(idChat, element.title)

	//SAVE LAST SEND
	lastIdsSent.push(element.id)
	let sv = await db.saveLastId(dataBase, lastIdsSent, idPlayList)
	//console.log(sv)

	if (urls == null) return
	sendVideo(urls)
}

async function sendVideo(urls) {
	//console.log(urls)
	console.log("SEND VIDEO")
	try {
		await bot.telegram.sendVideo(idChat, urls[0])
	} catch (error) {
		console.log("Falló url1")
		try {
			if (urls.length > 1) await bot.telegram.sendVideo(idChat, urls[1])
		} catch (error) {
			console.log("Falló url2")
		}
	}

	logVideoSend()
}

function logVideoSend() {
	const d = new Date()
	let seconds = d.getSeconds().toString()
	console.log("Video enviado " + seconds)
}

//bot.launch()
console.log("Index END")
module.exports = { mainBot }
