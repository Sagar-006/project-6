import StreamView from "@/components/StreamView";


export default async function CreatorPage({ params }: {params:Promise<{creatorId:string}>}) {
  const { creatorId } = await params;

  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
