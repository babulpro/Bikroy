// app/api/user/location/route.js (PUT method)
export async function PUT(request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json(
                { status: "failed", msg: "Unauthorized" },
                { status: 401 }
            );
        }
        
        const decodedToken = await DecodedJwtToken(token);
        const reqBody = await request.json();
        const { addressId, latitude, longitude, area, city, state, country } = reqBody;
        
        // Update existing address
        if (addressId) {
            const updatedAddress = await prisma.address.update({
                where: { id: addressId },
                data: {
                    latitude: latitude ? parseFloat(latitude) : undefined,
                    longitude: longitude ? parseFloat(longitude) : undefined,
                    area: area,
                    city: city,
                    state: state,
                    country: country
                }
            });
            
            return NextResponse.json({
                status: "success",
                data: updatedAddress
            });
        }
        
        // Or create new address
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id }
        });
        
        const newAddress = await prisma.address.create({
            data: {
                userId: user.id,
                country: country,
                state: state,
                city: city,
                area: area,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            }
        });
        
        return NextResponse.json({
            status: "success",
            data: newAddress
        });
        
    } catch (error) {
        console.error("Location update error:", error);
        return NextResponse.json(
            { status: "fail", msg: "Something went wrong" },
            { status: 500 }
        );
    }
}