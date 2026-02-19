export default function TechTicketDetails({ params }: { params: { id: string } }) {
  return <h1 className="text-2xl font-bold">Тикет техника #{params.id}</h1>;
}
