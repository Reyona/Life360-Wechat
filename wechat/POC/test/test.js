Page({
    data:{
        origElemPostion:[{
            'top':'45px',
            'left':'95px',
            'width':'100px',
            'fontSize':'10px',
            'zIndex':'1',
            'text':'test1',
            'isHidden':false
        },{
            'top':'85px',
            'left':'70px',
            'width':'150px',
            'fontSize':'12px',
            'zIndex':'2',
            'text':'test2',
            'isHidden':false
        },{
            'top':'125px',
            'left':'45px',
            'width':'200px',
            'fontSize':'14px',
            'zIndex':'3',
            'text':'test3',
            'isHidden':false
        },{
            'top':'165px',
            'left':'20px',
            'width':'250px',
            'fontSize':'16px',
            'zIndex':'4',
            'text':'test4',
            'isHidden':false
        },{
            'top':'205px',
            'left':'0px',
            'width':'300px',
            'fontSize':'18px',
            'zIndex':'5',
            'text':'test5',
            'isHidden':false
        }],
        elemPostion:[{
            'top':'45px',
            'left':'95px',
            'width':'100px',
            'fontSize':'10px',
            'zIndex':'1',
            'text':'test1',
            'isHidden':false
        },{
            'top':'85px',
            'left':'70px',
            'width':'150px',
            'fontSize':'12px',
            'zIndex':'2',
            'text':'test2',
            'isHidden':false
        },{
            'top':'125px',
            'left':'45px',
            'width':'200px',
            'fontSize':'14px',
            'zIndex':'3',
            'text':'test3',
            'isHidden':false
        },{
            'top':'165px',
            'left':'20px',
            'width':'250px',
            'fontSize':'16px',
            'zIndex':'4',
            'text':'test4',
            'isHidden':false
        },{
            'top':'205px',
            'left':'0px',
            'width':'300px',
            'fontSize':'18px',
            'zIndex':'5',
            'text':'test5',
            'isHidden':false
        }],
        testText:[{
            'top':'350px',
            'left':'0px',
            'width':'50px',
            'fontSize':'14px',
            'zIndex':'999',
            'text':'test5'
        }]
    },
    onShow:function(){
        var me = this;
        setInterval(function(){
            var origText = this.data.testText;
            for(var i=0;i<origText.length;i++){
                origText[i].left = me.addPX(origText[i].left,2);
            }
            origText.push({
                'top':1+Math.random()*400+'px',
                'left':'0px',
                'width':'50px',
                'fontSize':'14px',
                'zIndex':'999',
                'text':'test'+Math.random()*100
            })
            this.setData({
                testText:origText
            });
        }.bind(me),500);
    },
    touchMove:function(event){
        // position ~ 程度 的公式
        var origElemPosition = this.data.elemPostion;
        for(var i=origElemPosition.length-1;i>0;i--){
            origElemPosition[i].top = this.addPX(origElemPosition[i].top,1);
            origElemPosition[i].left = this.addPX(origElemPosition[i].left,1);
            origElemPosition[i].width = this.addPX(origElemPosition[i].width,1);
            origElemPosition[i].fontSize = this.addPX(origElemPosition[i].fontSize,1);
            origElemPosition[i].zIndex = +(origElemPosition[i].zIndex) + 1;
        }
        this.setData({
            elemPostion:origElemPosition
        });
    },
    addPX:function(pxContext, add){
        var pxNum = +pxContext.replace('px','');
        return pxNum+add+'px';
    },
    touchEnd:function(event){
        return;
        console.log(event);
        var origElemPosition = this.data.origElemPostion;
        /*
        for(var i=origElemPosition.length-1;i>0;i--){
            origElemPosition[i].top=origElemPosition[i-1].top;
            origElemPosition[i].left=origElemPosition[i-1].left;
            origElemPosition[i].width=origElemPosition[i-1].width;
            origElemPosition[i].fontSize=origElemPosition[i-1].fontSize;
            origElemPosition[i].zIndex=origElemPosition[i-1].zIndex;
        }*/
        var lastestHidden = this.getTheLatestHidden();
        if(lastestHidden >= 0){
            origElemPosition[lastestHidden].isHidden = true;
            for(var i=0;i<lastestHidden;i++){
                origElemPosition[i].top=origElemPosition[i+1].top;
                origElemPosition[i].left=origElemPosition[i+1].left;
                origElemPosition[i].width=origElemPosition[i+1].width;
                origElemPosition[i].fontSize=origElemPosition[i+1].fontSize;
                origElemPosition[i].zIndex=origElemPosition[i+1].zIndex;
            }

        }
        

        this.setData({
            elemPostion:origElemPosition
        });
    },
    getTheLatestHidden: function(){
        var origElemPosition = this.data.elemPostion;
        for(var i=0;i<origElemPosition.length;i++){
            if(origElemPosition[i].isHidden){
                return i - 1;
            }
        }
        return origElemPosition.length - 1;
    }
});