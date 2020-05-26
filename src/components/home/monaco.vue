<template>
  <div class="myEditor">
    <!--<p>-->
      <!--<span class="theme">-->
                <!--<Select v-model="theme" size="small" @on-change="themeChange" placeholder="请选择主题">-->
                    <!--<Option-->
                      <!--v-for="item in themeOption"-->
                      <!--:key="item.value"-->
                      <!--:label="item.label"-->
                      <!--:value="item.value">-->
                    <!--</Option>-->
                <!--</Select>-->
            <!--</span>-->
    <!--</p>-->
    <div id="container" ref="container" class="monaco-container" :style="{height: Mheight,width: Mwidth}"></div>
  </div>
</template>
<script>
  import * as monaco from 'monaco-editor';
  export default {
    props:{
      Mheight:{
        type:String,
        default:function(){
          return '300px'
        }
      },
      Mwidth:{
        type:String,
        default:function(){
          return '100%'
        }
      },
      theme:{
        type:String,
        default:function(){
          return 'vs'
        }
      },
      codes:{
        type:String,
        default:function(){
          return ''
        }
      },
      language:{
        type:String,
        default:function(){
          return 'html'
        }
      },
      editorOptions:{
        type:Object,
        default:function(){
          return {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,        // 只读
            cursorStyle: 'line',        //光标样式
            automaticLayout: false, //自动布局
            glyphMargin: true,  //字形边缘
            useTabStops: false,
            fontSize: 28,       //字体大小
            autoIndent:true,//自动布局
            //quickSuggestionsDelay: 500,   //代码提示延时
          }
        }
      }
    },
    data(){
      return{
        themeOption:[
          {
            value:'vs',
            label:'默认'
          },
          {
            value:'hc-black',
            label:'高亮'
          },
          {
            value:'vs-dark',
            label:'深色'
          },
        ],
//        codesCopy:null,//内容备份
        screenWidth:'',
        timer:false,

        monacoEditor:'',//实例
      }
    },
    watch:{
      screenWidth(val){
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if(!this.timer){
          // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
          this.screenWidth = val
          this.timer = true
          let that = this
          setTimeout(function(){
            // 打印screenWidth变化的值
            that.initEditor();
            that.timer = false
          },500)
        }
      },
    },
    mounted(){
      this.initEditor();
      let self = this;
      window.onresize = () => {
        return (() => {
          self.screenWidth = document.documentElement.offsetWidth;
        })()
      };
    },
    methods:{
      initEditor(){
        let self = this;
        self.$refs.container.innerHTML = '';
        self.monacoEditor = monaco.editor.create(self.$refs.container, {
          value: self.codes,
          language: self.language,
          theme: self.theme,//vs, hc-black, or vs-dark
          editorOptions:self.editorOptions,
        });
        self.$emit('onMounted',self.monacoEditor);//编辑器创建完成回调
        self.monacoEditor.onDidChangeModelContent(function(event){//编辑器内容changge事件
//          self.codesCopy = self.monacoEditor.getValue();
          self.$emit('onCodeChange',self.monacoEditor.getValue(),event);
        });
      },
      themeChange(val){
        this.initEditor();
      }
    }
  }
</script>
<style scoped>
  .monaco-container{
    height:100%;
    /*width: calc(100% - 20px);*/
    width: 100%;
    text-align: left;
  }
</style>
