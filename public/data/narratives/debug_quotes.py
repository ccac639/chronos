f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()
line=lines[208]
# Count quotes on this line
count=0
for c in line:
    if c == '"':
        count += 1
print(f"Line 209 has {count} double quotes")
# Should have an even number for valid JS
if count % 2 != 0:
    print("ODD number of quotes - this is the bug")
    # Show each quote position
    pos = 0
    for i, c in enumerate(line):
        if c == '"':
            print(f"  Quote at pos {i}: ...{line[max(0,i-5):i+5]}...")
f.close()
