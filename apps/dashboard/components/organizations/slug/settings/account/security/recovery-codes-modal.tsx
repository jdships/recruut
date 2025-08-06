'use client';

import NiceModal, { type NiceModalHocProps } from '@ebay/nice-modal-react';
import saveAs from 'file-saver';

import { APP_NAME } from '@workspace/common/app';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@workspace/ui/components/drawer';
import { toast } from '@workspace/ui/components/sonner';
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query';
import { MediaQueries } from '@workspace/ui/lib/media-queries';

import { useCopyToClipboard } from '~/hooks/use-copy-to-clipboard';
import { useEnhancedModal } from '~/hooks/use-enhanced-modal';

function splitIntoChunks(str: string, sep: string, chunkSize: number): string {
  return str.match(new RegExp(`.{1,${chunkSize}}`, 'g'))?.join(sep) || '';
}

export type RecoveryCodesModalProps = NiceModalHocProps & {
  recoveryCodes: string[];
};

export const RecoveryCodesModal = NiceModal.create<RecoveryCodesModalProps>(
  ({ recoveryCodes }) => {
    const modal = useEnhancedModal();
    const mdUp = useMediaQuery(MediaQueries.MdUp, { ssr: false });
    const copyToClipboard = useCopyToClipboard();
    const title = 'Recovery codes';
    const description =
      'Each recovery code can be used exactly once to grant access without your authenticator.';
    const handleCopyRecoveryCodes = async (): Promise<void> => {
      await copyToClipboard(
        recoveryCodes
          .map((recoveryCode) => splitIntoChunks(recoveryCode, '-', 5))
          .join('\n')
      );
      toast.success('Copied!');
    };
    const handleDownloadRecoveryCodes = () => {
      const filename = `${APP_NAME}-recovery-codes.txt`;
      const content = recoveryCodes
        .map((recoveryCode) => splitIntoChunks(recoveryCode, '-', 5))
        .join('\n');
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, filename);
    };
    const renderContent = (
      <div className="mb-4 grid grid-cols-2 gap-1 text-center font-mono font-medium">
        {recoveryCodes.map((recoveryCode) => (
          <div key={recoveryCode}>{splitIntoChunks(recoveryCode, '-', 5)}</div>
        ))}
      </div>
    );
    const renderButtons = (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={modal.handleClose}
        >
          Close
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCopyRecoveryCodes}
        >
          Copy
        </Button>
        <Button
          type="button"
          variant="default"
          onClick={handleDownloadRecoveryCodes}
        >
          Download
        </Button>
      </>
    );
    return (
      <>
        {mdUp ? (
          <AlertDialog open={modal.visible}>
            <AlertDialogContent
              className="max-w-lg"
              onClose={modal.handleClose}
              onAnimationEndCapture={modal.handleAnimationEndCapture}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
              {renderContent}
              <AlertDialogFooter>{renderButtons}</AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Drawer
            open={modal.visible}
            onOpenChange={modal.handleOpenChange}
          >
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>{title}</DrawerTitle>
                <DrawerDescription>{description}</DrawerDescription>
              </DrawerHeader>
              {renderContent}
              <DrawerFooter className="flex-col-reverse pt-4">
                {renderButtons}
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </>
    );
  }
);
