import { Editor } from '@monaco-editor/react';
import { Card } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  theme?: string;
  height?: string;
}

export const CodeEditor = ({ 
  value, 
  onChange, 
  language, 
  theme = 'vs-dark',
  height = '100%'
}: CodeEditorProps) => {
  const handleEditorDidMount = (editor: any) => {
    // Custom configuration for the editor
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      lineNumbers: 'on',
      renderLineHighlight: 'line',
      automaticLayout: true,
    });
  };

  return (
    <Card className="h-full flex flex-col gradient-card shadow-soft overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-card-foreground">Code Editor</h2>
        <p className="text-sm text-muted-foreground">Write your C code to create linked lists</p>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height={height}
          language={language}
          theme={theme}
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading editor...
              </div>
            </div>
          }
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
            suggest: {},
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
          }}
        />
      </div>
      
      <div className="p-3 border-t bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Language: {language.toUpperCase()}</span>
          <span>Theme: {theme}</span>
        </div>
      </div>
    </Card>
  );
};