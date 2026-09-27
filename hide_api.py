import os
import glob
import re

src_dir = os.path.join("frontend", "src")
files = glob.glob(src_dir + "/**/*.tsx", recursive=True)

def replacer(match):
    prefix = match.group(1) # `"` or ```
    url = match.group(2)    # `http://localhost:8000`
    suffix = match.group(3) # rest of the string till quote
    
    if "http" in url:
        return f'`${{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}}{suffix}`'
    else:
        return f'`${{process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}}{suffix}`'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "localhost:8000" in content:
        # We look for "http://localhost:8000/..." or `http://localhost:8000/...`
        # and replace the whole string with a template literal.
        
        # Pattern to match "http://localhost:8000..." or `http://localhost:8000...`
        new_content = re.sub(r'([\"`])(https?://localhost:8000)(.*?)\1', 
                             lambda m: f'`${{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}}{m.group(3)}`', 
                             content)
        
        new_content = re.sub(r'([\"`])(wss?://localhost:8000)(.*?)\1', 
                             lambda m: f'`${{process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}}{m.group(3)}`', 
                             new_content)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file}")

print("Done hiding APIs!")
