package ajweb.model;




public class Param  implements Expression{
	public String key;
	public Parameterable value;
	
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return key + " : " + value ;
	}

	
}
