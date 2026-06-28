import json, os

OUT = r"C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives"

def A(id,title,key,scene,npcs,dlgs):
    return {"id":id,"title":title,"isKeyAct":key,"sceneDescription":scene,"npcDialogues":npcs,"dialogues":dlgs}
def D(id,text,spk,av,score,evt,note,cons):
    return {"id":id,"text":text,"speaker":spk,"avatar":av,"score":score,"triggeredEvent":evt,"historicalNote":note,"consequence":cons}
def N(spk,text,av):
    return {"speaker":spk,"text":text,"avatar":av}
def write_json(name, data):
    path = os.path.join(OUT, name)
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"{name} written ({os.path.getsize(path)} bytes)")

batch1_path = r"C:\Users\2121\.trae-cn\work\6a3ed37f1ac00f6e4879b1c0\gen_remaining_batch1.py"
with open(batch1_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix N("张学良","张","我扣押...)  -> N("张学良","我扣押...","张")
content = content.replace(
    'N("张学良","张","我扣押蒋介石不是为了杀他，而是为了逼他抗日。希望中共方面理解我的苦衷。","张")',
    'N("张学良","我扣押蒋介石不是为了杀他，而是为了逼他抗日。希望中共方面理解我的苦衷。","张")'
)

# Fix the two comment issues
content = content.replace(
    '结束了十年的动乱。",(习近平不是这个时代的人。这里不涉及。 NPCs改用叶剑英、华国锋等),[N("周恩来","(周恩来已于1976年1月去世)","周"),N("华国锋","我们必须尽快结束动乱',
    '结束了十年的动乱。",[N("叶剑英","我们必须尽快结束动乱'
)
content = content.replace(
    '改革开放的总设计师，领导中国走上了快速发展的道路。",(此时playerRole已切换到邓小平),[N("周恩来","(周恩来已于1976年去世，此处为历史的回响)","周"),N("百姓","改革开放让我们的生活',
    '改革开放的总设计师，领导中国走上了快速发展的道路。",[N("叶剑英","改革开放让我们的生活'
)

with open(batch1_path, 'w', encoding='utf-8') as f:
    f.write(content)

exec(compile(content, batch1_path, 'exec'))
