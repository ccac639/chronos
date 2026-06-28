f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()

# Line 209 (index 208) has an odd number of quotes
# Let's just replace the whole line with a clean version
lines[208] = 'D("d5","社会主义制度的建立为新中国的进一步发展奠定了制度基础。","我","毛",83,"社会主义制度的确立","到1956年底社会主义改造基本完成社会主义制度在中国基本确立这意味着中国实现了从新民主主义到社会主义的转变这一转变为中国后来的发展奠定了制度基础。","制度基础已经奠定。"),\n'

f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','w',encoding='utf-8')
f.write(''.join(lines))
f.close()

# Verify
f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines2=f.readlines()
count = lines2[208].count('"')
print(f"Line 209 now has {count} quotes (should be 14)")
f.close()
print("fixed!")
