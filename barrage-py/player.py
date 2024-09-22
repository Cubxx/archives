import pygame,math,time

class Player():
    firedelay=20 #发射子弹间隔时间
    score=0 #分数
    lives=5 #生命值

    def __init__(self,master,x,y):
        self._master=master #父控件
        self.image=pygame.image.load("./img/player-y.png") #图像
        #自机位置
        self.x=x
        self.y=y
        #子弹
        self.t=0 #子弹发射初始时间
        self.bullets=[] #存放存在于界面中的子弹
                               
    #移动自机
    def move(self,x,y):
        if 0<=self.x+26/2+x<=self._master.get_width():
            self.x+=x
        if 0<=self.y+26/2+y<=self._master.get_height():
            self.y+=y

    #指定位置绘制自机
    def draw(self):
        self._master.blit(self.image,(self.x,self.y))
        
    # 发射子弹
    def fire(self):
        self.t+=1
        if self.t>=self.firedelay:
            self.t=0
            # 子弹初始坐标
            bx=self.x+int(self.image.get_width()/2)
            by=self.y
            bullet=Bullet(self._master,bx,by)
            self.bullets.append(bullet)

    # 更新子弹位置，清除失效的子弹
    def update_bullets(self):
        survive=[]
        for b in self.bullets:
            b.update()
            if b.on:
                survive.append(b)
        self.bullets=survive

    # 绘制子弹
    def draw_bullets(self):
        for b in self.bullets:
            b.draw()

    #子弹撞击敌机
    def check_all_hit(self,bosslist):
        survive=[]
        for b in self.bullets:
            b.check_hit(bosslist)
            if b.on:
                survive.append(b)
        self.bullets=survive
        
    #敌机和自机撞击
    def get_distance(self,xy):
        x,y=xy
        cx=self.x+26/2
        cy=self.y+26/2
        return math.sqrt(math.pow(cx-x,2)+math.pow(cy-y,2))

    def check_crash(self,bosslist):
        for boss in bosslist:
            if boss.lives>0:# and boss.inWindow():
                d=self.get_distance(boss.get_center_XY())
                if d<=26/2+boss.get_radius(): #自机碰撞敌机
                    Player.lives-=1
                    boss.lives-=1
                    time.sleep(0.1) #碰撞后暂停秒数
                    Player.score-=50

                 
class Bullet():
    spd=10 #子弹移动速度
    color=(255,0,0)
    radius=5

    def __init__(self,master,x,y):
        self._master=master # 父控件
        self.x=x
        self.y=y
        # 记录子弹状态，初始为True
        self.on=True

    # 移动子弹
    def update(self):
        self.y-=self.spd

        if self.y<=0: #超出边界
            self.on=False

    # 绘制圆形子弹
    def draw(self):
        pygame.draw.circle(self._master, self.color, (self.x,self.y), self.radius)

    def get_distance(self,xy):
        x,y=xy
        return math.sqrt(math.pow(self.x-x,2)+math.pow(self.y-y,2))

    def check_hit(self,bosslist):
        for boss in bosslist:
            if boss.lives>0:
                d=self.get_distance(boss.get_center_XY())
                if d<=boss.get_radius(): #子弹撞击敌机
                    self.on=False
                    boss.lives-=1
                    Player.score+=10