;((window) => {
    function keyup(e) {
        let _this = this
        if (e.type == "click") e.keyCode = 32
        // console.log("keyup", e.keyCode)
        if (e.keyCode === 32) {
            // 创建点
            if (bombObj["create"].length == 20) return
            _this.bomb.create(_this.map, (div) => {
                if (bombObj["create"].length === 0) {
                    bombObj["create"].push({"id": 0, "0": div})
                } else {
                    bombObj["create"].push({"id": bombObj["create"][bombObj["create"].length - 1]["id"] + 1, "0": div})
                }
                _this.bomb.move()
            }, "white")
        }
    }
    function keydown(e) {
        let _this = this
        if (e.type == "touchstart") {
            if (e.target.id == "left") e.keyCode = 37
            if (e.target.id == "right") e.keyCode = 39
            if (e.target.id == "up") e.keyCode = 38
            if (e.target.id == "down") e.keyCode = 40
        }
        switch (e.keyCode) {
            case 37:
                _this.bomb.x = _this.bomb.x - 10
                break
            case 38:
                _this.bomb.y = _this.bomb.y - 10
                break
            case 39:
                _this.bomb.x = _this.bomb.x + 10
                break
            case 40:
                _this.bomb.y = _this.bomb.y + 10
                break
        }
        if (_this.bomb.x >= _this.map.offsetWidth) {
            _this.bomb.x = _this.map.offsetWidth - 10
        } else if (_this.bomb.x < 0) {
            _this.bomb.x = 0
        } else if (_this.bomb.y >= _this.map.offsetHeight) {
            _this.bomb.y = _this.map.offsetHeight - 10
        } else if (_this.bomb.y < 0) {
            _this.bomb.y = 0
        }
        _this.bomb.render(_this.bomb.map)
    }

    var map = document.querySelector("#map")
    var bombObj = {
        "header": null,
        "create": []
    }
    var monsterObj = []

    function Bomb(options) {
        // 自身参数
        options = options || {}
        this.w = options.w || 10
        this.h = options.h || 10
        this.x = options.x || 10
        this.y = options.y || 10
        this.color = options.color || "red"

        // 挂载地图
        this.map = map
        // 挂载定时器
        this.moveTimer = null// 本体移动
        this.moveMonsterTimer = null// 敌人移动
        this.createMonsterTimer = null// 创建敌人
        this.clearTimer = null// 会面
    }
    // 创建本体
    Bomb.prototype.init = function (map) {
        this.create(map, (div) => {
            bombObj["header"] = div
        })
    }
    // 移动本体
    Bomb.prototype.render = function () {
        bombObj["header"].style.left = this.x + "px"
        bombObj["header"].style.top = this.y + "px"
    }
    // 创建发射的子弹
    Bomb.prototype.create = function (map, fn, color) {
        let div = document.createElement("div")
        div.style.position = "absolute"
        div.style.zIndex = color ? 0 : 1
        div.style.left = this.x + "px"
        div.style.top = this.y + "px"
        div.style.width = this.w + "px"
        div.style.height = this.h + "px"
        div.style.backgroundColor = color || this.color
        map.appendChild(div)
        fn(div)
    }
    // 让子弹动起来,超出屏幕删除子弹
    Bomb.prototype.move = function() {
        if (this.moveTimer) return
        this.moveTimer = setInterval(() => {
            // 清除子弹定时器
            if (bombObj["create"].length === 0) {
                clearInterval(this.moveTimer)
                this.moveTimer = null
            }
            for (var i in bombObj["create"]) {
                if (parseInt(bombObj["create"][i][0].style.left) >= this.map.offsetWidth - 10) {
                    this.remove(bombObj["create"][i][0], i)
                } else {
                    bombObj["create"][i][0].style.left = (parseInt(bombObj["create"][i][0].style.left) + 1) + "px"
                }
            }
        })
    }
    // 创建敌人
    Bomb.prototype.createMonster = function (map) {
        let div = document.createElement("div")
        div.style.position = "absolute"
        div.style.zIndex = 1
        div.style.left = (this.map.offsetWidth + 10) + "px"
        div.style.top = parseInt(Math.random() * 50) * 10 + "px"
        div.style.width = this.w + "px"
        div.style.height = this.h + "px"
        div.style.backgroundColor = "yellow"
        map.appendChild(div)
        monsterObj.push(div)
    }
    // 让敌人动起来
    Bomb.prototype.moveMonster = function(step = 1) {
        this.moveMonsterTimer = setInterval(() => {
            for (var m = 0; m < monsterObj.length; m++) {
                monsterObj[m].style.left = (parseInt(monsterObj[m].style.left) - step) + "px"
            }
        })
        // 挂载子弹与敌人碰撞|会面
        this.collision()
    }
    // 子弹与敌人会面时，扫除敌人与子弹
    Bomb.prototype.collision = function() {
        this.clearTimer = setInterval(() => {
            for (var m = 0; m < monsterObj.length; m++) {
                for (var b in bombObj["create"]) {
                    if ((monsterObj[m].style.top == bombObj["create"][b][0].style.top)
                        && (parseInt(monsterObj[m].style.left) <= parseInt(bombObj["create"][b][0].style.left))) {
                        monsterObj[m].parentNode.removeChild(monsterObj[m])
                        bombObj["create"][b][0].parentNode.removeChild(bombObj["create"][b][0])
                        monsterObj.splice(m, 1)
                        bombObj["create"].splice(b, 1)
                        return
                    }
                }
            }
        })
    }
    // 超出屏幕，删除子弹
    Bomb.prototype.remove = function (div, i) {
        div.parentNode.removeChild(div)
        bombObj["create"].splice(i, 1)
    }
    window.Bomb = Bomb
    window.keyup = keyup
    window.keydown = keydown
    window.map = map
    window.bombObj = bombObj
    window.monsterObj = monsterObj
})(window)
