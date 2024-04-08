import { createReactInlineContentSpec } from '@blocknote/react';

export const TagSpec = createReactInlineContentSpec(
  {
    type: 'tag',
    propSchema: {
      name: {
        default: 'Unknown',
      },
    },
    content: 'none',
  },
  {
    render: props => (
      <span
        data-type="tag"
        style={{
          padding: '2px 5px',
          marginRight: '4px',
          // backgroundColor: 'hsl(var(--secondary))',
          backgroundColor: 'hsl(var(--primary) / 7%)',
          // backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '4px',
          color: 'hsl(var(--primary))',
          // color: 'rgb(59, 130, 246)',
          fontSize: '12px',
          fontWeight: 600,
          lineHeight: '16px',
        }}
      >
        #{props.inlineContent.props.name}
      </span>
    ),
  }
);
