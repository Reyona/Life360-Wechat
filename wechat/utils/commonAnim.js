
module.exports = {
    showAddBtnAnim: showAddBtnAnim,
    resetAnim: resetAnim
}


function showAddBtnAnim(element){
    element.animation = wx.createAnimation({
      duration: 1000,
        timingFunction: 'ease'        
    })
    element.animation.scale(2,2).rotate(360).step();   
    element.setData({
        animation: element.animation.export()
    })
}

function resetAnim(element){
    if(element.animation){
        element.animation.rotate(0).scale(1).translate(0,0).skew(0,0).step({
            duration:1000
        }); 
        element.setData({
        animation: element.animation.export()
        })
    }
}
