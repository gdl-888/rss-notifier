const async = require('asyncawait').async;
const await = require('asyncawait').await;

const fs = require('fs');
const child_process = require('child_process');

const Parser = require('rss-parser');
const parser = new Parser;

const print = console.log;

function shell(file) {
    var args = [];
    for(arg in arguments) {
        if(arg == 0) continue;
        args[Number(arg) - 1] = arguments[arg];
    }
    
    return child_process.execFileSync(file, args);
}

function timeout(ms) {
	return new Promise(r => setTimeout(() => r(0), ms));
}

const subscriptions = [
	'https://rss.***.***/***.xml',
];

if(!fs.existsSync('./rss.json')) {
	fs.writeFileSync('./rss.json', '{}');
}

const lastsub = require('./rss.json');

(async (() => {
	while(1) for(url of subscriptions) {
		var feed = await (parser.parseURL(url));
		if(!feed || !feed.items || !feed.items.length) continue;
		
		with(feed.items[0]) {
			try {
				if(!link.startsWith('http://') && !link.startsWith('https://')) throw(0);
				if(lastsub[url] != link) {
					shell('alert', feed.title + '에 새로운 글 ' + title + '이(가) 올라왔읍니다.\r\n\r\n확인하시겠습니까?');
					shell('cmd', '/c start ' + link.replace(/(>|<|&|[|])/g, ''));
				}
			} catch(e) {
				print('게시글 확인: ' + link);
			} finally {
				if(lastsub[url] != link) {
					lastsub[url] = link;
					fs.writeFile('./rss.json', JSON.stringify(lastsub), err => err ? print('데이타 저장 오류...') : 0);
				}
			}
		}
		
		await (timeout(1000));
	}
}))();
