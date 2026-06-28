f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()
line=lines[208]
# Check around pos 35-40 more carefully
for i in range(30, min(60, len(line))):
    c = line[i]
    print(f"  pos {i}: char='{c}' (U+{ord(c):04X})")
f.close()
