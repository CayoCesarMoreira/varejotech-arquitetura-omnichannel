from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

# 1. Configuração da página em modo wide
st.set_page_config(
    page_title="VarejoTech Omnichannel - TO-BE",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# 4. Remover margens padrão do Streamlit via CSS
st.markdown(
    """
    <style>
        /* Remove padding e margens padrão do container do Streamlit */
        .block-container {
            padding-top: 0rem !important;
            padding-bottom: 0rem !important;
            padding-left: 0rem !important;
            padding-right: 0rem !important;
            max-width: 100% !important;
        }
        [data-testid="stAppViewBlockContainer"] {
            padding: 0rem !important;
        }
        header[data-testid="stHeader"] {
            display: none !important;
        }
        footer {
            display: none !important;
        }
        #MainMenu {
            visibility: hidden !important;
        }
        iframe {
            display: block;
            width: 100% !important;
            border: none;
        }
    </style>
    """,
    unsafe_allow_html=True,
)

# Diretório base relativo ao arquivo atual
BASE_DIR = Path(__file__).resolve().parent

# 2. Ler conteúdo dos arquivos locais
index_path = BASE_DIR / "index.html"
css_path = BASE_DIR / "styles.css"
js_path = BASE_DIR / "app.js"

html_content = index_path.read_text(encoding="utf-8")
css_content = css_path.read_text(encoding="utf-8")
js_content = js_path.read_text(encoding="utf-8")

# 3. Injetar styles.css e app.js diretamente no HTML para funcionamento autônomo
style_tag = f"<style>\n{css_content}\n</style>"
script_tag = f"<script>\n{js_content}\n</script>"

if '<link rel="stylesheet" href="styles.css" />' in html_content:
    html_completo = html_content.replace('<link rel="stylesheet" href="styles.css" />', style_tag)
elif '<link rel="stylesheet" href="styles.css">' in html_content:
    html_completo = html_content.replace('<link rel="stylesheet" href="styles.css">', style_tag)
else:
    html_completo = html_content.replace("</head>", style_tag + "\n</head>")

if '<script src="app.js"></script>' in html_completo:
    html_completo = html_completo.replace('<script src="app.js"></script>', script_tag)
else:
    html_completo = html_completo.replace("</body>", script_tag + "\n</body>")

# 4. Renderizar o HTML completo ocupando toda a tela
components.html(html_completo, height=1200, scrolling=True)
