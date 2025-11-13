import StreamView from "@/components/StreamView";

interface CreatorPageProps {
  params: {
    creatorId: string;
  };
}

export default async function CreatorPage({ params }: {params:Promise<{creatorId:string}>}) {
  const { creatorId } = await params;

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
