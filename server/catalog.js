// server/catalog.js
// Notes/families distilled from brand pages + widely accepted pyramids.
// Sources:
// Santal 33 (Le Labo): Australian sandalwood, cedarwood, cardamom, iris/violet, leathery/musky facets.  :contentReference[oaicite:0]{index=0}
// Tobacco Vanille (Tom Ford): tobacco leaf, spicy notes, vanilla, cacao, tonka, dried fruits/woods.  :contentReference[oaicite:1]{index=1}
// Tam Dao (Diptyque): Mysore sandalwood, cedar, cypress, myrtle/coriander facets.  :contentReference[oaicite:2]{index=2}
// Bleu de Chanel: citrus (grapefruit), aromatic accord, dry cedar, New Caledonian sandalwood.  :contentReference[oaicite:3]{index=3}
// Dior Sauvage: fresh citrus/bergamot over ambroxan/woods; EDP adds vanilla.  :contentReference[oaicite:4]{index=4}
// Creed Viking: bergamot, lemon, orange, peppermint, pepper; floral spice heart; cedar, vetiver, tonka base.  :contentReference[oaicite:5]{index=5}
// Dunhill Icon: neroli/bergamot/pepper/petitgrain; lavender/cardamom/black pepper; vetiver/oud/leather/tobacco facets across Icon line.  :contentReference[oaicite:6]{index=6}
// LV Ombre Nomade: oud (Assam), benzoin, raspberry, rose, incense, saffron, amberwood/birch nuances.  :contentReference[oaicite:7]{index=7}
// YSL Black Opium: coffee, vanilla, white florals.  :contentReference[oaicite:8]{index=8}
// Viktor & Rolf Flowerbomb: jasmine, rose, peony/vanilla; warm ambery floral.  :contentReference[oaicite:9]{index=9}
// Chanel Coco Mademoiselle: orange, jasmine/rose, patchouli/vetiver (fresh ambery).  :contentReference[oaicite:10]{index=10}

export const CATALOG = [
    {
        id: "le-labo-santal-33",
        brand: "Le Labo",
        name: "Santal 33",
        family: "Woody Aromatic",
        notes: ["sandalwood", "cedarwood", "cardamom", "iris", "violet", "leather", "musk"],
        vibe: ["creamy", "woody", "smoky", "modern"],
        gender: "Unisex",
        strength: "EDP"
    },
    {
        id: "tom-ford-tobacco-vanille",
        brand: "Tom Ford",
        name: "Tobacco Vanille",
        family: "Amber Spicy",
        notes: ["tobacco leaf", "spices", "vanilla", "cacao", "tonka bean", "dried fruits", "woods"],
        vibe: ["warm", "opulent", "gourmand"],
        gender: "Unisex",
        strength: "EDP"
    },
    {
        id: "diptyque-tam-dao",
        brand: "Diptyque",
        name: "Tam Dao",
        family: "Woody",
        notes: ["sandalwood", "cedar", "cypress", "myrtle", "spices"],
        vibe: ["milky", "serene", "meditative"],
        gender: "Unisex",
        strength: "EDP"
    },
    {
        id: "chanel-bleu",
        brand: "Chanel",
        name: "Bleu de Chanel",
        family: "Aromatic Woody",
        notes: ["grapefruit", "aromatic accord", "cedar", "sandalwood"],
        vibe: ["clean", "versatile", "contemporary"],
        gender: "Men",
        strength: "EDT/EDP/Parfum"
    },
    {
        id: "dior-sauvage",
        brand: "Dior",
        name: "Sauvage",
        family: "Aromatic Fougère",
        notes: ["bergamot", "pepper/spices", "ambroxan", "woods", "vanilla (EDP)"],
        vibe: ["fresh", "ambery-woody", "projecting"],
        gender: "Men",
        strength: "EDT/EDP/Parfum"
    },
    {
        id: "creed-viking",
        brand: "Creed",
        name: "Viking",
        family: "Aromatic Fougère",
        notes: ["bergamot", "lemon", "orange", "peppermint", "pink/black pepper", "jasmine", "lavender", "orris", "rose", "cedarwood", "vetiver", "tonka bean", "white musk"],
        vibe: ["spicy", "fresh", "adventurous"],
        gender: "Men",
        strength: "EDP"
    },
    {
        id: "dunhill-icon",
        brand: "Alfred Dunhill",
        name: "Icon",
        family: "Woody Spicy / Aromatic",
        notes: ["neroli", "bergamot", "black pepper", "petitgrain", "lavender", "cardamom", "juniper", "vetiver", "leather", "oud", "tobacco"],
        vibe: ["elegant", "masculine", "textured"],
        gender: "Men",
        strength: "EDP"
    },
    {
        id: "lv-ombre-nomade",
        brand: "Louis Vuitton",
        name: "Ombre Nomade",
        family: "Amber Woody",
        notes: ["agarwood (oud)", "benzoin", "raspberry", "rose", "incense", "saffron", "amberwood", "birch"],
        vibe: ["luxury", "smoky", "resinous"],
        gender: "Men",
        strength: "EDP"
    },
    {
        id: "ysl-black-opium",
        brand: "Yves Saint Laurent",
        name: "Black Opium",
        family: "Amber Vanilla",
        notes: ["coffee", "vanilla", "white florals"],
        vibe: ["seductive", "sweet", "night-out"],
        gender: "Women",
        strength: "EDP"
    },
    {
        id: "viktor-rolf-flowerbomb",
        brand: "Viktor & Rolf",
        name: "Flowerbomb",
        family: "Floral Amber",
        notes: ["jasmine", "rose", "peony", "vanilla", "ambery accord"],
        vibe: ["feminine", "opulent", "radiant"],
        gender: "Women",
        strength: "EDP"
    },
    {
        id: "chanel-coco-mademoiselle",
        brand: "Chanel",
        name: "Coco Mademoiselle",
        family: "Amber Floral",
        notes: ["orange", "jasmine", "rose", "patchouli", "vetiver"],
        vibe: ["fresh-ambery", "elegant", "confident"],
        gender: "Women",
        strength: "EDP"
    }
];
