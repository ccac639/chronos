f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
lines=f.readlines()

# Fix lines 216, 245, 257 (index 215, 244, 256)
for idx in [215, 244, 256]:
    line = lines[idx]
    count = line.count('"')
    if count % 2 != 0:
        # Find the D() call and rewrite it using template literal (backtick)
        # Actually, simpler: just remove all Chinese commas from the consequence field
        # The pattern is: the last field before the closing ), is the consequence
        # The issue is a Chinese comma ， inside a double-quoted string that breaks parsing
        
        # Let's find the consequence text - it's after the last quoted note field
        # Just replace the entire line content
        
        # Extract parts
        # Find d-id
        import re
        m = re.match(r'(D\("d\d+","[^"]*","[^"]*","[^"]*",\d+,"[^"]*","[^"]*",")(.*)(",")(\s*\))', line)
        if m:
            # The issue is in the note field - it has an unmatched quote
            print(f"  Line {idx+1}: Using regex replacement")
            # Just replace Chinese punctuation with no punctuation
            new_line = line
            # Simpler approach: escape any double quote inside the string
            # Actually the simplest fix: replace the Chinese comma in the historicalNote with a period
            # Find the historicalNote section - it's the 7th quoted string
            # Let me just count the segments
            pass
        
        # Brute force: extract the content between the quotes properly
        # The D() call has 7 fields: id, text, speaker, avatar, score, event, note, consequence
        # Each field is wrapped in double quotes
        # But the consequence field has a Chinese comma that JavaScript confuses with a field separator
        
        # Simplest fix: replace the FULL_LINE with a backtick template
        # Actually even simpler: in the consequence text, remove Chinese commas
        
        # Find the consequence text (after the note field)
        # Replace ， with 。 in the consequence portion
        consequence_start = line.rfind('","') + 3  # after the last ""," pair
        if consequence_start > 0:
            consequence = line[consequence_start:]
            # The consequence should be inside quotes ending with "),
            # But it has an embedded quote issue
            # Just replace the whole approach: use JSON to write directly
            pass
        
        # Nuclear option: just write the correct JSON files directly using Python
        print(f"  Line {idx+1}: Will fix by rewriting")

f.close()

# Actually, the cleanest approach: parse the file as best we can, fix the broken lines
# The issue is always the same pattern: Chinese comma ， in text causing JS to split the string
# Fix by removing all Chinese commas from these specific lines and replacing with nothing

f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','r',encoding='utf-8')
content=f.read()
f.close()

# For each problematic pattern: "text with ，inside","  -> the ， is not the problem
# The actual problem is that JS sees "," as a parameter separator
# But wait - the strings are all wrapped in quotes, so commas inside quotes should be fine
# UNLESS there's a missing closing quote somewhere

# Let me look at this differently. The actual issue might be 
# that my original generation had mismatched quotes in some text
# Let me just find and fix ALL lines with odd quote counts by adding/removing a quote

lines = content.split('\n')
for i, line in enumerate(lines):
    count = line.count('"')
    if count % 2 != 0:
        # Find where the odd quote is and fix it
        quote_positions = [j for j, c in enumerate(line) if c == '"']
        # Walk through pairs of quotes - find the unmatched one
        paired = True
        for k in range(0, len(quote_positions)-1, 2):
            # Check if text between quotes looks right
            pass
        
        # Simple approach: look for Chinese comma followed by Chinese text followed by a quote
        # The issue pattern is likely: ...text，text"... where the comma separates two fields
        # But it's inside a single field
        
        # Actually, the cleanest fix: replace the offending line entirely
        # Since these are in the junior-prc section, let me just fix the 3 known bad lines
        
        if i == 215:  # Line 216
            lines[i] = 'D("d5","建设社会主义是一项前无古人的事业难免会犯错误关键是要从错误中学习不断改进。","我","毛",78,"从错误中学习","毛泽东虽然犯了一些严重错误但他也认识到了从错误中学习的重要性。1981年的历史决议对毛泽东的历史功过做出了全面评价毛泽东的功绩是第一位的错误是第二位的。","功过要分开来看。"),\n'
        elif i == 244:  # Line 245
            lines[i] = 'D("d5","到1980年代末中国的GDP比1978年翻了将近一番改革开放的成效已经初步显现。","我","邓",85,"改革开放初见成效","改革开放前十年1978-1988年中国经济实现了快速增长。GDP年均增长率接近10%人民生活水平显著提高。这一成果初步证明了改革开放政策的正确性。","改革开放初见成效。"),\n'
        elif i == 256:  # Line 257
            lines[i] = 'D("d3","全面建成小康社会实现了第一个百年奋斗目标这是一代又一代人接力奋斗的结果。","我","邓",90,"全面建成小康社会","2020年中国宣布全面建成小康社会实现了第一个百年奋斗目标。人均GDP突破1万美元近1亿农村贫困人口全部脱贫。这是人类历史上规模最大的减贫奇迹。","小康社会全面建成。"),\n'
        
        new_count = lines[i].count('"')
        print(f"  Fixed line {i+1}: {count} -> {new_count} quotes")

content = '\n'.join(lines)
f=open(r'C:\Users\2121\AppData\Roaming\TRAE SOLO CN\ModularData\ai-agent\work-mode-projects\6a3ed37f1ac00f6e4879b1bd\chronos-app\src\data\narratives\gen_batch2.js','w',encoding='utf-8')
f.write(content)
f.close()
print("All fixed!")
