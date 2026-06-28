import json, os, re

OUT = r"C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives"

def A(id,title,key,scene,npcs,dlgs):
    return {"id":id,"title":title,"isKeyAct":key,"sceneDescription":scene,"npcDialogues":npcs,"dialogues":dlgs}
def D(id,text,spk,av,score,evt,note,cons):
    return {"id":id,"text":text,"speaker":spk,"avatar":av,"score":score,"triggeredEvent":evt,"historicalNote":note,"consequence":cons}
def N(spk,text,av):
    return {"speaker":spk,"text":text,"avatar":av}
def w(name, data):
    p = os.path.join(OUT, name)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"{name} written ({os.path.getsize(p)} bytes)")

path = os.path.join(OUT, "gen_qinhan.py")
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix N() calls with 4 arguments (extra avatar arg before text)
# Pattern: N("name","singlechar","text","singlechar") -> N("name","text","singlechar")
content = content.replace('N("王翦","秦","大王，末将愿率六十万大军伐楚。楚地辽阔，非重兵不可取胜。","王")', 'N("王翦","大王，末将愿率六十万大军伐楚。楚地辽阔，非重兵不可取胜。","王")')

# Remove Chinese parenthetical comments outside strings
import re
# Remove patterns like ，(Chinese text outside string),[
content = content.replace('。",(秦始皇尚未去世，但此处用叙述视角描述时局),[', '。",[')
content = content.replace('。",(此处playerRole为叙述视角),[', '。",[')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

exec(compile(content, path, 'exec'))
