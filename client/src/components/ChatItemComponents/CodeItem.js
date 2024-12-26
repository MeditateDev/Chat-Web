import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeItem = (props) => {
  const { children, className, node, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  const codes = String(children).replace(/\n$/, '');
  // const [isCopied, setIsCopied] = useState(false);

  return match ? (
    <div className='bg-gray-800 rounded-md border-solid border-gray-800 border text-gray-300 overflow-hidden'>
      <div className='flex justify-between items-center px-2 py-1'>
        {match[1]}
        {/* <Tooltip content={`${isCopied ? 'Copied!' : 'Copy'}`}>
          <IconButton
            className='border-none text-center bg-transparent cursor-pointer'
            variant='text'
            size='md'
            onClick={async (e) => {
              e.preventDefault();
              if (window.parent) {
                await window.parent.navigator.clipboard.writeText(codes);
              } else {
                await navigator.clipboard.writeText(codes);
              }
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 1000);
            }}>
            <img
              src={restoreDownIcon}
              className='w-3'
              style={{
                filter: 'invert(1)',
              }}
              alt='Copy Button'
            />
          </IconButton>
        </Tooltip> */}
      </div>
      <SyntaxHighlighter
        {...rest}
        PreTag='div'
        children={codes}
        language={match[1]}
        style={vscDarkPlus}
        showLineNumbers={true}
        customStyle={{ margin: 0, colorScheme: 'dark' }}
      />
    </div>
  ) : (
    <div className='max-w-full max-h-[50vh] inline-flex'>
      <pre className='px-2 bg-white rounded-md overflow-auto m-0'>
        <code {...rest} className={`text-red-700`}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeItem;
