import { useQuery } from "@tanstack/react-query";
import MedicineCard from "@/components/MedicineCard";
import { supabase } from "@/integrations/supabase/client";

const fetchMedicines = async () => {
  const { data, error } = await supabase
    .from("medicines")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching medicines:", error);
    throw error;
  }

  return data;
};

const Medicines = () => {
  const {
    data: medicines = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["medicines"],
    queryFn: fetchMedicines,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 bg-herbal text-herbal-foreground text-sm font-medium rounded-full mb-6">
              Siddha Medicines
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Traditional Medicines & Tonics
            </h1>
            <p className="text-lg text-muted-foreground">
              Authentic Siddha medicines prepared using traditional methods and
              pure herbal ingredients. Consultation recommended before purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="bg-herbal border-y border-border">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-herbal-foreground">
            <strong>⚕️ Medical Advice:</strong> Please consult with the doctor
            before purchasing any medicine. All medicines require proper
            diagnosis and dosage guidance.
          </p>
        </div>
      </section>

      {/* Medicines Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          {/* Loading */}
          {isLoading && (
            <p className="text-center text-muted-foreground">
              Loading medicines...
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-center text-red-500">
              Failed to load medicines.
            </p>
          )}

          {/* Empty State */}
          {!isLoading && medicines.length === 0 && (
            <p className="text-center text-muted-foreground">
              No medicines available at the moment.
            </p>
          )}

          {/* Data */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                id={medicine.id}
                name={medicine.name}
                price={medicine.price}
                description={medicine.description}
                usedFor={
                  medicine.used_for
                    ? medicine.used_for.split(",")
                    : []
                }
                images={
                  medicine.images && medicine.images.length > 0
                    ? medicine.images
                    : []
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 nature-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
              How to Order Medicines
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We follow a consultation-first approach to ensure you receive the
              right medicine for your specific health condition.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-soft">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">
                Select Medicine
              </h3>
              <p className="text-sm text-muted-foreground">
                Browse our medicines and click "Consult & Buy" on the product
                you're interested in.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-soft">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">
                Consult Doctor
              </h3>
              <p className="text-sm text-muted-foreground">
                Discuss your health condition via WhatsApp to ensure the medicine
                is right for you.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4 shadow-soft">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">
                Receive Medicine
              </h3>
              <p className="text-sm text-muted-foreground">
                After approval, we'll arrange delivery along with proper dosage
                instructions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Medicines;
