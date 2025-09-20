import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CodeDisplayProps {
  code: string;
  language: string;
  title?: string;
}

export const CodeDisplay = ({ code, language, title = "Generated C Code" }: CodeDisplayProps) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code Copied!",
        description: "The generated code has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linked_list.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded!",
      description: `Code saved as linked_list.${language}`,
    });
  };

  return (
    <Card className="h-full flex flex-col gradient-card shadow-soft">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">Auto-generated from your visual design</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-0">
        <div className="h-full bg-code-bg text-code-foreground font-mono text-sm overflow-auto">
          <pre className="p-4 h-full">
            <code className="language-c">
              {code}
            </code>
          </pre>
        </div>
      </div>
      
      <div className="p-3 border-t bg-muted/50">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Language: {language.toUpperCase()}</span>
          <span>{code.split('\n').length} lines</span>
        </div>
      </div>
    </Card>
  );
};