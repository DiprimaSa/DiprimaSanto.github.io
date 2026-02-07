#!/usr/bin/env python3

with open('index.html', 'r') as f:
    content = f.read()

# Trovo e estrai la sezione EDUCATION
edu_start = content.find('                <!-- EDUCATION -->')
edu_end = content.find('                </div>\n</div>\n\n              </div>', edu_start)

if edu_start != -1 and edu_end != -1:
    edu_end += len('                </div>')
    education_section = content[edu_start:edu_end]
    
    # Rimuovi Education dalla posizione attuale
    content_without_edu = content[:edu_start] + content[edu_end:]
    
    # Trovo dove inserire (prima della chiusura della sezione CV)
    # Cerco il pattern prima di </div></article> del CV
    close_pattern = '              </div>\n            </div>\n          </div>\n        </article>'
    close_pos = content_without_edu.find(close_pattern)
    
    if close_pos != -1:
        # Inserisci Education prima della chiusura
        new_content = content_without_edu[:close_pos] + '\n\n' + education_section + '\n' + content_without_edu[close_pos:]
        
        with open('index.html', 'w') as f:
            f.write(new_content)
        print("✓ Education spostato fuori da Publications!")
    else:
        print("✗ Impossibile trovare il punto di inserimento")
else:
    print("✗ Education non trovato")
