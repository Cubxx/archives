import pygame,sys,random,os,time,math
from player import Player
from boss import Boss,BossManager

FPS=60 #游戏帧率
PAUSE=False #控制暂停

pygame.init() #初始化
clock=pygame.time.Clock() #控制帧率的对象
win=pygame.display.set_mode((600,600)) #窗体对象
pygame.display.set_caption('Barrage Game') #游戏名

""" #音乐
pygame.mixer.init()
pygame.mixer.music.load(r'./Avelife.mp3')
pygame.mixer.music.set_volume(0.1)
pygame.mixer.music.play() """

player=Player(win,300,500) #自机初始位置
spd=10 #自机初始移动速度
mx,my=0,0
level=1 #关卡
degree='Easy' #默认难度
s=0 #自机死亡后，计时器
scorecard=dict(zip(['Easy','Normal','Hard','Lunatic'],[[0 for i in range(7)] for i in range(4)])) #计分卡
get=dict(zip(['Easy','Normal','Hard','Lunatic'],[[0 for i in range(7)] for i in range(4)])) #已通关卡

bm=BossManager(win) 
boss=Boss(win,-600,0) #敌机初始位置

while True:
    win.fill((0,0,0)) #背景色

    for event in pygame.event.get():#遍历事件
        if event.type == pygame.QUIT:#事件为点击右上角退出键
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key==pygame.K_ESCAPE or event.key == pygame.K_SPACE: #暂停
                PAUSE=not PAUSE
                
            if event.key==pygame.K_LEFT or event.key == ord('a'):
                mx=-1
            if event.key==pygame.K_RIGHT or event.key == ord('d'):
                mx=1
            if event.key==pygame.K_UP  or event.key == ord('w'):
                my=-1
            if event.key==pygame.K_DOWN  or event.key == ord('s'):
                my=1
            if event.key==pygame.K_LSHIFT: #按住左shift低速模式
                spd=4
            if event.key==pygame.K_KP_ENTER  or event.key == ord('z'):
                level=1+level%7;Player.score=0;Player.lives=5
                
            if event.key==pygame.K_KP_1 or event.key == ord('1'):
                level=1;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_2 or event.key == ord('2'):
                level=2;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_3  or event.key == ord('3'):
                level=3;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_4  or event.key == ord('4'):
                level=4;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_5  or event.key == ord('5'):
                level=5;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_6  or event.key == ord('6'):
                level=6;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_7  or event.key == ord('7'):
                level=7;Player.score=0;Player.lives=5
            if event.key==pygame.K_KP_8  or event.key == ord('8'):
                level=8;Player.score=0;Player.lives=50
            
            if event.key==pygame.K_F1:
                degree='Easy';Player.score=0;Player.lives=5
            if event.key==pygame.K_F2:
                degree='Normal';Player.score=0;Player.lives=5
            if event.key==pygame.K_F3:
                degree='Hard';Player.score=0;Player.lives=5
            if event.key==pygame.K_F4:
                degree='Lunatic';Player.score=0;Player.lives=5

        if event.type == pygame.KEYUP:
            if event.key==pygame.K_LEFT or event.key == ord('a'):
                if mx==-1:
                    mx=0
            if event.key==pygame.K_RIGHT or event.key == ord('d'):
                if mx==1:
                    mx=0
            if event.key==pygame.K_UP  or event.key == ord('w'):
                if my==-1:
                    my=0
            if event.key==pygame.K_DOWN  or event.key == ord('s'):
                if my==1:
                    my=0
            if event.key==pygame.K_LSHIFT:
                spd=10

    # 难度选择
    if degree=='Easy':
        BossManager.cd=30
        Boss.a_1=2
        Boss.a_2,Boss.b_2=5,5
        Boss.a_3,Boss.b_3=5,5
        Boss.a_4=2;Boss.b_4=3
        Boss.a_7=15
        Boss.a_6,Boss.b_6=2,2
    if degree=='Normal':
        BossManager.cd=20
        Boss.a_1=2
        Boss.a_2,Boss.b_2=10,5
        Boss.a_3,Boss.b_3=5,7
        Boss.a_4=3;Boss.b_4=3
        Boss.a_7=18
        Boss.a_6,Boss.b_6=3,3
    if degree=='Hard':
        BossManager.cd=15
        Boss.a_1=3
        Boss.a_2,Boss.b_2=10,10
        Boss.a_3,Boss.b_3=4,9
        Boss.a_4=5;Boss.b_4=4
        Boss.a_7=18
        Boss.a_6,Boss.b_6=4,4
    if degree=='Lunatic':
        BossManager.cd=10
        Boss.a_1=4
        Boss.a_2,Boss.b_2=15,10
        Boss.a_3,Boss.b_3=4,10
        Boss.a_4=7;Boss.b_4=5
        Boss.a_7=20
        Boss.a_6,Boss.b_6=5,5

        
    if  player.lives>=0: # 判断生死
        
        # 通关
        scorecardl=list(scorecard.items()) #玩家数据
        if player.score>=200 and level in (1,2,3,4,5,6,7):
            scorecard[degree][level-1]=player.score #记录分数
            get[degree][level-1]=1 #记录通关  
        for scdeg in get:
            if get[scdeg]==[1 for i in range(7)]: # happy ending
                level=0 #结局关卡
                font_1 = pygame.font.Font('FZXIANGSU12.TTF', 80)
                # 玩家得分数据
                scorecards_1 = font.render('{:>10}:{:<40}'.format(scorecardl[0][0],str(scorecardl[0][1])), True, [255, 255, 255])
                scorecards_2 = font.render('{:>10}:{:<40}'.format(scorecardl[1][0],str(scorecardl[1][1])), True, [255, 255, 255])
                scorecards_3 = font.render('{:>10}:{:<40}'.format(scorecardl[2][0],str(scorecardl[2][1])), True, [255, 255, 255])
                scorecards_4 = font.render('{:>10}:{:<40}'.format(scorecardl[3][0],str(scorecardl[3][1])), True, [255, 255, 255])
                deadtxt_1 = font_1.render('{: ^}'.format('CONGRATULATIONS'), True, [255, 255, 255])
                deadtxt_2 = font.render('{: ^}'.format('Thanks for playing !'), True, [255, 255, 255])
                staff = font.render('{: ^}'.format('Design by cube_17    '), True, [255, 255, 255],)
                win.blit(scorecards_1,(50,80))
                win.blit(scorecards_2,(50,100))
                win.blit(scorecards_3,(50,120))
                win.blit(scorecards_4,(50,140))
                win.blit(deadtxt_1, (0, 200))
                win.blit(deadtxt_2, (50, 300))
                s+=1
                if s>180: #3s
                    win.blit(staff, (50, 350))

        if PAUSE:
            boss.update(level)
            
            player.check_all_hit(bm.bosslist) #子弹撞击敌机
            player.check_crash(bm.bosslist) #自机撞击敌机

            bm.generate()
            bm.update(level)
            
            player.move(mx*spd,my*spd)
            
            player.fire()
            player.update_bullets()

        #显示自机、敌机、子弹
        player.draw()
        bm.draw()
        boss.draw()
        player.draw_bullets()
        
        #信息
        font = pygame.font.Font('FZXIANGSU12.TTF', 20) #字体
        lives = font.render('Lives {: <300}'.format(player.lives), True, [0,0,0], [255, 255, 255])
        score = font.render('Score {: <300.0f}'.format(player.score), True, [0,0,0], [255, 255, 255])
        levels = font.render('Level {: <.0f} {: <10}  '.format(level,degree), True, [0,0,0], [255, 255, 255])
        gets = font.render('{: <300}'.format(str(get[degree])), True, [0,0,0], [255, 255, 255])
        win.blit(levels, (0, 0)) #控制显示位置
        win.blit(gets, (150, 0))
        win.blit(lives, (400, 0))
        win.blit(score, (500, 0))

    else: # bad ending
        font = pygame.font.Font('FZXIANGSU12.TTF', 20)
        font_1 = pygame.font.Font('FZXIANGSU12.TTF', 100)
        # 玩家得分数据
        scorecards_1 = font.render('{:>10}:{:<40}'.format(scorecardl[0][0],str(scorecardl[0][1])), True, [255, 255, 255])
        scorecards_2 = font.render('{:>10}:{:<40}'.format(scorecardl[1][0],str(scorecardl[1][1])), True, [255, 255, 255])
        scorecards_3 = font.render('{:>10}:{:<40}'.format(scorecardl[2][0],str(scorecardl[2][1])), True, [255, 255, 255])
        scorecards_4 = font.render('{:>10}:{:<40}'.format(scorecardl[3][0],str(scorecardl[3][1])), True, [255, 255, 255])
        deadtxt_1 = font_1.render('{: ^}'.format('GAME OVER'), True, [255, 255, 255], [0,0,0])
        deadtxt_2 = font.render('{: ^}'.format('Thanks for playing !'), True, [255, 255, 255], [0,0,0])
        staff = font.render('\r{: ^}'.format('Design by cube_17    '), True, [255, 255, 255], [0,0,0])
        win.blit(deadtxt_1, (50, 200))
        win.blit(deadtxt_2, (50, 350))
        win.blit(scorecards_1,(50,80))
        win.blit(scorecards_2,(50,100))
        win.blit(scorecards_3,(50,120))
        win.blit(scorecards_4,(50,140))
        
        s+=1
        if s>180: #3s
            win.blit(staff, (50, 350))
        """ if s==480: #8s
            pygame.quit()
            sys.exit() """

    clock.tick(FPS) #每秒循环次数
    pygame.display.update()