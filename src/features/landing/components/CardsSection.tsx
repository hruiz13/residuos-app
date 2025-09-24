import Image from "next/image";


const cards = [
  {
    id: 1,
    title: "Reduce la contaminación",
    description: "El reciclaje ayuda a disminuir la cantidad de residuos que terminan en vertederos y océanos, reduciendo la contaminación del suelo, agua y aire.",
    imageUrl: "/images/eco1.jpg",
  },
  {
    id: 2,
    title: "Ahorra energía",
    description: "Reciclar materiales como el aluminio y el papel consume menos energía que producirlos desde cero, lo que contribuye a la conservación de recursos naturales.",
    imageUrl: "/images/eco2.jpg",
  },
  {
    id: 3,
    title: "Conserva recursos naturales",
    description: "El reciclaje permite reutilizar materiales, disminuyendo la necesidad de extraer nuevos recursos naturales como madera, minerales y petróleo.",
    imageUrl: "/images/eco3.jpg",
  }
]

const CardsSection = () => {
  return ( <div >
    <h2 className="text-2xl font-bold mb-4 text-center">¿Por qué reciclar?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map(card => (
        <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Image src={card.imageUrl} alt={card.title} width={200} height={200} className="m-auto object-cover"/>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
    
  </div> );
}
 
export default CardsSection;