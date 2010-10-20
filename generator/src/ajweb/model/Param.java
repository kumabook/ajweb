package ajweb.model;




public class Param  implements Expression{
	public String key;
	public Primitive value;
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return key + " : " + value ;
	}
}
