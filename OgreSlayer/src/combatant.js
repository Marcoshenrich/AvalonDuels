export default class Combatant {
    constructor() {
        this.animationState = "idle"
        this.animations = [];
        this.animationQueue = []
        this.animationTripper = -1
        this.attack = 0
        this.block = 0
    }

    animationFramesSetter() {
        this.animationStates.forEach((spriteState) => {
            let frames = {
                loc: [],
                src: spriteState.src
            }
            for (let j = 0; j < spriteState.frames; j++) {
                let positionX = j * this.spriteWidth;
                let positionY = 0;
                frames.loc.push({ x: positionX, y: positionY });
            }
            this.animations[spriteState.name] = frames;
        });
    }

    draw(ctx, gameFrame, staggerFrames, heightOffset) {
        let rawPosition = (gameFrame / staggerFrames) % this.animations[this.animationState].loc.length
        let position = Math.floor(rawPosition)

        if (this.animationState !== "dead") {
            if (this.animationQueue.length > 0 && this.animationState === "idle") {
                this.animationQueueSetter()
                position = 0
            }

            if ((rawPosition + .15) > this.animationTripper) {
                this.animationQueueSetter()
                position = 0
            }
        }   

        let frameX = this.spriteWidth * position;
        let frameY = this.animations[this.animationState].loc[position].y
        ctx.drawImage(this.image, frameX, frameY, this.spriteWidth, this.spriteHeight, this.xPosition, this.yPosition - heightOffset, Math.floor(this.spriteWidth * this.sizeCoef), Math.floor(this.spriteHeight * this.sizeCoef))
    }

    heal(healVal) {
        if (this.health + healVal > this.maxHealth) {
            this.health = this.maxHealth
        } else {
            this.health += healVal
        }
    }

    animationQueueSetter() {
        if (this.animationQueue.length === 0) {
            this.animation("idle")
        } else {
            let aniStateName = this.animationQueue.shift()
            this.animation(aniStateName)
        } 
    }

    framesFinder(aniStateName) {
        for (let i in this.animationStates) {
            let frameObj = this.animationStates[i]
            if (frameObj["name"] === aniStateName) return frameObj["frames"]
        }
    }

    animation = function(aniStateName) {
        // if (this.constructor.name === "Knight") console.log(this.animations["attack"]);
        // if (this.constructor.name === "Knight") console.log(aniStateName);

        this.animationState = aniStateName
        this.image.src = this.animations[aniStateName].src
        this.animationTripper = this.framesFinder(aniStateName)
    }

}