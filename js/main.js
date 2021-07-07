;((window) => {
    let inputs = document.querySelectorAll("#start-button>input")
    let start = inputs[0]
    start.addEventListener("click", () => {
        // 创建游戏实例
        let game = new Game(map)
        alert("正在启动游戏")
        // 启动游戏
        game.start()
        start.disabled = true
    })
})(window)
