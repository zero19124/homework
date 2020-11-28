// 实现这个项目的构建任务
// 导入基础方法
const { src, dest, parallel, series, watch } = require('gulp')
// 清空方法
// const del = require('del')
// 服务器
const browserSync = require('browser-sync')
const del = require('del')
// 自动加载插件所有插件都会进入这个返回的对象
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
// 插件服务器
const bs = browserSync.create()
// 获取当前路径
const cwd = process.cwd()

const clean = () => {
    // 配置需要删除的文件夹
    return del(['dist'])
  }

// css文件处理
const style = () => {
    // 参数1 处理哪里的文件  参数2 按照原始目录结构输出
    return src('src/assets/styles/*.scss',{ base:'src' })
      .pipe(plugins.sass())
    //   输出位置
      .pipe(dest('dist'))
    //   重新加载服务器获取最新数据
      .pipe(bs.reload({ stream: true }))
  }
  // script 文件处理
const script = () => {
    // 参数1 处理哪里的文件  参数2 按照原始目录结构输出
    return src('src/assets/scripts/*.js',  { base:'src' } )
      .pipe(plugins.babel({ presets: ['@babel/preset-env']}))
    //   输出位置
      .pipe(dest('dist'))
    //   重新加载服务器获取最新数据
      .pipe(bs.reload({ stream: true }))
  }
  //  html 文件处理
const page = () => {
    // 参数1 处理哪里的文件  参数2 按照原始目录结构输出
    return src('src/*.html',  { base:'src' } )
    //1 需要模板中替换的参数 2 是否使用缓存
      .pipe(plugins.swig({data:{ name:'jack'}, defaults: { cache: false } }))
    //   输出位置
      .pipe(dest('dist'))
    //   重新加载服务器获取最新数据
      .pipe(bs.reload({ stream: true }))
  }

    //  其他 文件处理
const extra = () => {
    // 参数1 处理哪里的文件  参数2 按照原始目录结构输出
    return src('src/**',  { base:'src' } )
    //   输出位置
      .pipe(dest('dist'))
   
  }

  const serve = ()=>{
      watch('src/assets/styles/*.scss',style)
      watch('src/assets/scripts/*.js',script)
      watch('src/*.html',page)
      
      watch([
        'src/assets/images/**',
        'src/assets/fonts/**'
      ], bs.reload)
    
      watch('public/**', bs.reload)

      bs.init({
          notify:false,
          server:{baseDir:'temp',routes:{'/node_modules': 'node_modules'}}
      })
  }

  const useref = () => {
    return src('dist/*.html')
      .pipe(plugins.useref())
      // html js css
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      })))
      .pipe(dest('temp'))

  }
  const temp2dist = ()=>{
    src('temp/**',{base:'temp'}).pipe(dest('dist'))
      
      return del(['temp'])
  }


//   不适应，因为命令行会被占用
//   const observe = ()=>{
//       watch('src/assets/styles/*.scss',dev)
//   }
  const dev = series(clean,parallel(style,script,page),serve)
    
  const build = series(clean,style,script,page,extra,useref)

//   导出gulp方法
module.exports = {
    clean,
    dev,
    serve,
    build,
    useref
  
  
  }
