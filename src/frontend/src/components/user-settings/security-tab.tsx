import { SecurityContent, type SecurityContentProps } from './security-content';

interface SecurityTabProps {
  securityProps: SecurityContentProps;
}

export function SecurityTab({ securityProps }: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <SecurityContent {...securityProps} />
    </div>
  );
}
