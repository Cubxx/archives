import pygame,math,time,random

class Boss():
    img_r=78 #敌机边长
    a_1=0
    a_2,b_2=0,0
    a_3,b_3=0,0
    a_4,b_4=0,0
    a_6,b_6=0,0
    a_7=0
    
    def __init__(self,master,x,y):
        self._master=master #父控件
        self.image=pygame.image.load('./img/boss.png')
        self.x=x
        self.y=y
        self.lives=1

    # 敌机移动位置//关卡
    def update(self,n):
        if n==1:
            self.x+=Boss.a_1*math.cos(time.time())
            self.y+=3 #关卡1，集体上下正弦'''
        if n==2:
            self.x+=random.randint(-Boss.a_2,Boss.a_2)*math.cos(time.time())
            self.y+=3+random.randint(-Boss.b_2,Boss.b_2)*math.cos(time.time())
            #关卡2，定时抖动'''
        if n==3:
            self.x+=0
            self.y+=Boss.a_3+Boss.b_3*math.cos(1*time.time()) #关卡3，上下移动'''
        if n==4:
            self.x+=Boss.a_4*math.cos(0.02*self.y)
            self.y+=Boss.b_4 #关卡4，个体上下正弦'''
        if n==5:
            if self.x>600*(1+math.cos(time.time())):
                self.x-=self.y*0.005
            if self.x<600*(1+math.cos(time.time())):
                self.x+=self.y*0.005
            self.y+=5 #关卡5，个体汇聚'''
        if n==6:
            self.x+=Boss.a_6*math.cos(0.02*self.y)
            self.y+=3-Boss.b_6*math.sin(0.02*self.x)#关卡6，个体上下左右正弦'''
        if n==7:
            if self.y>0:
                self.x+=math.log(0.002*self.y)
                self.y+=Boss.a_7 #关卡7，弹幕雨'''
            else:
                self.x+=0.01
                self.y+=Boss.a_7
        if n==0:
            self.x+=0
            if len(BossManager.bosslist)<50:
                self.y+=10*math.cos(1/300*self.y)
            else:
                self.y+=self.y*0.01 # 结局
        if n==8:
            self.x+=0
            self.y+=0.1*self.y
            #调试用

        if self.y>1200 or self.y<-600 or self.x>1200 or self.x<-600: 
            # 删除 x,y 在-600~1200之外的弹幕
            self.lives=0

    def draw(self):
        self._master.blit(self.image,(self.x,self.y))

    def get_center_XY(self):
        # 获取圆心坐标
        return (self.x+self.img_r/2,self.y+self.img_r/2)

    def get_radius(self):
        # 获取半径
        return self.img_r/2

class BossManager():
    cd=15 # 生成敌机的时间间隔//数量
    bosslist=[]

    def __init__(self,master):
        self._master=master
        self.time=0
        
    def generate(self): #弹幕增殖
        self.time+=1
        if self.time%self.cd==0:
            x=random.randint(1,self._master.get_width()-Boss.img_r) #水平位置随机生成
            bossl=Boss(self._master,x,1) #生成很多随机位置敌机
            BossManager.bosslist.append(bossl)

    def update(self,n):
        survive=[]
        for boss in BossManager.bosslist:
            boss.update(n)
            # if boss.inWindow():修改前
            if boss.lives>0:
                survive.append(boss)
        BossManager.bosslist=survive

    def draw(self):
        for boss in BossManager.bosslist:
            boss.draw()
