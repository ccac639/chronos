import re
f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
t=f.read()
f.close()

# Fix line 209: the text has an unescaped double quote
old='D("d5","\u793e\u4f1a\u4e3b\u4e49\u5236\u5ea6\u7684\u5efa\u7acb\uff0c\u4e3a\u65b0\u4e2d\u56fd\u7684\u8fdb\u4e00\u6b65\u53d1\u5c55\u5960\u5b9a\u4e86\u5236\u5ea6\u57fa\u7840\u3002","'
new='D("d5","\u793e\u4f1a\u4e3b\u4e49\u5236\u5ea6\u7684\u5efa\u7acb\u4e3a\u65b0\u4e2d\u56fd\u7684\u8fdb\u4e00\u6b65\u53d1\u5c55\u5960\u5b9a\u4e86\u5236\u5ea6\u57fa\u7840\u3002","'
if old in t:
    t=t.replace(old, new)
    print('fixed with unicode escape')
else:
    print('not found, trying direct approach')
    # Read lines
    lines = t.split('\n')
    for i, line in enumerate(lines):
        if 'd5' in line and '\u793e\u4f1a\u4e3b\u4e49\u5236\u5ea6\u7684\u5efa\u7acb' in line:
            print(f'Found at line {i+1}')
            # Replace the comma after 制度建立 with nothing, to remove the problematic comma
            lines[i] = line.replace('\u5efa\u7acb\uff0c\u4e3a\u65b0', '\u5efa\u7acb\u4e3a\u65b0')
            print('Fixed!')
            break
    t = '\n'.join(lines)

f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','w',encoding='utf-8')
f.write(t)
f.close()
print('done')
