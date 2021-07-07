;((window) => {
    // 游戏句柄
    function Game(map) {
        // 挂载地图
        this.map = map
        // 挂载实体
        this.bomb = new Bomb()
        // 挂载定时器
        this.gameOverTimer = null
    }
    // 启动游戏
    Game.prototype.start = function() {
        this.bomb.init(this.map)
        this.bomb.render(this.map)

        this.bomb.createMonsterTimer = setInterval(() => {
            this.bomb.createMonster(this.map)
        }, 500)
        this.bomb.moveMonster()

        // keyup
        /*
         * 空格 32
         * 上 38  下 40  左 37  右 39
         */
        let _this = this
        addEventListener("keyup", keyup.bind(_this), false)
        addEventListener("keydown", keydown.bind(_this), false)
        // --------------------移动端 start--------------------------------
        // touchstart:  // 手指放到屏幕上的时候触发
        // touchmove:  // 手指在屏幕上移动的时候触发
        // touchend:  // 手指从屏幕上拿起的时候触发
        // touchcancel:  // 系统取消touch事件的时候触发。至于系统什么时候会取消 不知道。。

        // client / clientY：// 触摸点相对于浏览器窗口viewport的位置
        // pageX / pageY：// 触摸点相对于页面的位置
        // screenX /screenY：//触摸点相对于屏幕的位置
        // identifier： // touch对象的unique ID
        let spans = document.querySelectorAll("#direction>span")
        let s = spans[0], x = spans[1], z = spans[2], y = spans[3]
        s.addEventListener("touchstart", keydown.bind(_this), false)
        x.addEventListener("touchstart", keydown.bind(_this), false)
        z.addEventListener("touchstart", keydown.bind(_this), false)
        y.addEventListener("touchstart", keydown.bind(_this), false)
        // 发射子弹
        let launchBullet = document.querySelectorAll("#launch>span")
        launchBullet[0].onclick = keyup.bind(_this)
        // --------------------移动端 end--------------------------------
        this.gameOverTimer = setInterval(() => {
            this.gameOver(this.gameOverTimer, this.bomb.x, this.bomb.y)
        })
    }
    Game.prototype.gameOver = function(gameOverTimer, x, y) {
        for (var m in monsterObj) {
            // console.log(parseInt(monsterObj[m].style.left),x)
            if ((parseInt(monsterObj[m].style.left) == x) && (parseInt(monsterObj[m].style.top) == y)) {
                this.bomb.remove(monsterObj[m], m)
                let flag = window.confirm("游戏结束")
                // 清除游戏定时器
                clearInterval(this.bomb.moveTimer)
                clearInterval(this.bomb.moveMonsterTimer)
                clearInterval(this.bomb.createMonsterTimer)
                clearInterval(this.bomb.clearTimer)
                clearInterval(gameOverTimer)
                removeEventListener("keyup", keyup, false)
                removeEventListener("keydown", keydown, false)
                if (flag) window.location.reload()
            }
        }
    }
    window.Game = Game
})(window)
