#!/usr/bin/env node
const inquirer = require('inquirer')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
// console.log('cli');


inquirer.prompt([
    {
        type:'input',
        name:'name',
        message:'Input Your Project Name'
    }
]).then(anwser =>{
    // console.log(anwser);
        const tempDir = path.join(__dirname,'templates')
        // console.log(tempDir);F:\practise\lagou\homewok-cli\templates
        
        const destDir = process.cwd()
        fs.readdir(tempDir,(err,files)=>{
            // 拿到文件夹下的文件 [ 'index.html', 'inner-temp' ]
            console.log(files);
            if(err) throw err
            files.forEach(file =>{
                ejs.renderFile(path.join(tempDir,file),anwser,(err,result)=>{
                    if (err) throw err
                    // 写入
                    console.log(file);
                    fs.writeFileSync(path.join(destDir, file), result)
                })
            })

        })

})

