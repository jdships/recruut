'use client';

import Link from 'next/link';
import { ChevronRightIcon, InfoIcon } from 'lucide-react';

import { replaceOrgSlug } from '@workspace/routes';
import { PageTitle } from '@workspace/ui/components/page';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@workspace/ui/components/tooltip';

import { useActiveOrganization } from '~/hooks/use-active-organization';

export type OrganizationPageTitleProps = {
  index?: {
    route: Parameters<typeof replaceOrgSlug>[0];
    title: string;
  };
  title: string;
  info?: string;
};

export function OrganizationPageTitle({
  index,
  title,
  info
}: OrganizationPageTitleProps): React.JSX.Element {
  const { slug } = useActiveOrganization();
  return (
    <div className="flex flex-row items-center gap-2">
      {index && (
        <>
          <Link
            className="text-sm font-semibold hover:underline"
            href={replaceOrgSlug(index.route, slug)}
          >
            {index.title}
          </Link>
          <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground" />
        </>
      )}
      <PageTitle>{title}</PageTitle>
      {info && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <InfoIcon className="hidden size-3.5 shrink-0 text-muted-foreground sm:inline" />
          </TooltipTrigger>
          <TooltipContent>{info}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
