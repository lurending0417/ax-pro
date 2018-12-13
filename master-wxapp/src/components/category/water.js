// components/category/water.js
const {scaleSizeH}=require('../../utils/sizeUtil.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
        column:{
              type:Number,
              value:2,
        },
        columnWidth:{
              type:null,
        },
        rows:{
              type:Array,
              value:[],
              observer: function (nv,oldv) {
                    this.setRows(nv,true);
              }
        },
        
  },

  /**
   * 组件的初始数据
   */
  data: {
        isColumnWidthFixed:false,
        columns:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
        getColumnWidth:function(column){
              if(this.isColumnWidthFixed){
                    return this.columnWidth
              }
              return this.columnWidth(column)
        },
        setRows:function(newRows,willset=false){
            var i=0;
            let cl=this.properties.column;
            let columns= newRows.reduce((last,now)=>{
                  let id=i%cl;
                  last[id]=last[id]||[];
                  now.width=scaleSizeH(now.height-30,375,390)
                  last[id].push(now);
                   i++;
                   return last;
             },[])
             if(willset){
                   this.setData({
                         columns
                   })
             }
             else{
                   this.data.columns=columns;
             }

        }
  },

  created:function(){
        this.data.isColumnWidthFixed = typeof this.columnWidth !== 'function';
  }
})
