#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const download = require('download-git-repo');
const spawn = require('cross-spawn');
const argv = require('minimist')(process.argv.slice(2));
const pathExists = require('path-exists');
const commands = argv._;
const currentPath = path.resolve('.');
const help = require('../lib/help');



if (commands.length === 0) {
    if (argv.version || argv.v) {
        console.log(require('../package.json').version);
    } else {
        help.help();
    }
    process.exit(0);
}


switch (commands[0]) {
    case 'init':
        var name = null,
            template = null;
        if (commands[1]) {
            template = commands[1];
            name = commands[2];
        } else {
            help.help();
        }

        var root = path.resolve(name);
        if (!pathExists.sync(name)) {
            fs.mkdirSync(root);
        } else {
            console.log(chalk.red(`当前文件夹 ${name}  已经存在了，当前操作终止.`));
            process.exit(1);
        }
        console.log(chalk.yellow(`开始下载 ${name} 请稍等.`));
        download(`uba-templates/${template}`, `${name}`, function(err) {
            if (!err) {
                console.log(chalk.cyan(`最佳实践 ${name} 创建完毕.请执行 'cd ${name} && npm install' 进行安装.`));
            } else {
                console.log(chalk.red(`最佳实践下载失败，请检查最佳实践名字是否正确或网络错误.`));
            }
        });
        break;
    case 'server':
        var port = 3000;
        if (argv.p !== undefined && !isNaN(argv.p) && argv.p !== true) {
            port = argv.p;
        }
        const server = require('../lib/server');
        server(port);
        break;
    case 'build':
        const build = require('../lib/build');
        build();
        break;
    case 'publish':
        const publish = require('../lib/publish');
        publish();
        break;
    case 'page':
        var name = null;
        if (commands[1]) {
            name = commands[1];
        } else {
            help.help();
        }
        const page = require('../lib/page');
        page(name);
        break;
    default:
        console.log(chalk.red('命令不正确!'));
        break;
}