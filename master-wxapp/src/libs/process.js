import process from 'process'

//指定环境
process.env = {
	'NODE_ENV': 'production'
}

process.nextTick = process.nextTick || ((h) => setTimeout(h, 0))

global.process = process;