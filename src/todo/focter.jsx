import '../assets/styles/footer.styl'

export default{
    data(){
        return{
            authon:"james"
        }
    },
    render(){
        return(
            //javaScrip [].map(()) 来循环
           <div id="footer">
           <span>written by {this.authon}</span></div>
        )
    }
}
//.vue 和.jsx 文件最终都会转化成 render 方法。。