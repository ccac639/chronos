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

# Fix gen_qinhan.py by removing all Chinese comments outside strings
path = os.path.join(OUT, "gen_qinhan.py")
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Chinese parenthetical comments that appear outside string literals
# These are patterns like "。",(...Chinese comment...),[  or "。",(Chinese comment),[
content = content.replace('。",(秦始皇尚未去世，但此处用叙述视角描述时局),[', '。",[')
content = content.replace('。",(此处playerRole为叙述视角),[', '。",[')
content = content.replace('。",(此时playerRole已切换到邓小平),[', '。",[')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

exec(compile(content, path, 'exec'))
