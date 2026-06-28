f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()
line=lines[208]
# Show full line with markers
for i, c in enumerate(line):
    if c == '"':
        context = line[max(0,i-8):i+8]
        print(f"  pos {i}: ...{context}...")
f.close()
