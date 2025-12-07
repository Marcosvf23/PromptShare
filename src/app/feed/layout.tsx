import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed Personalizado | PromptShare",
  description:
    "Veja os posts mais recentes de pessoas que você segue na comunidade PromptShare",
};

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
